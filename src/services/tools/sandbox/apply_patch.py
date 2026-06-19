#!/usr/bin/env python3
import sys
import os

def main():
    # State tracking
    in_patch_block = False
    current_file = None
    action = None  # 'update', 'add', 'delete', 'rename'
    hunks = []
    cur_remove = []
    cur_add = []

    def flush_hunk():
        nonlocal cur_remove, cur_add
        if cur_remove or cur_add:
            hunks.append({"remove": cur_remove, "add": cur_add})
            cur_remove = []
            cur_add = []

    def flush_file():
        nonlocal current_file, action, hunks
        flush_hunk()
        if current_file and action:
            apply_file_changes(current_file, action, hunks)
        # Deep reset state for next file/patch block
        current_file = None
        action = None
        hunks = []

    # Read all lines from standard input
    lines = sys.stdin.readlines()

    for line_raw in lines:
        line = line_raw.rstrip('\r\n')

        if "*** Begin Patch" in line:
            flush_file()  # Safety flush if a previous block didn't close properly
            in_patch_block = True
            continue

        if "*** End Patch" in line:
            flush_file()
            in_patch_block = False
            continue

        if in_patch_block:
            if line.startswith("*** Update File:"):
                flush_file()
                current_file = line.replace("*** Update File:", "").strip()
                action = 'update'
            elif line.startswith("*** Add File:"):
                flush_file()
                current_file = line.replace("*** Add File:", "").strip()
                action = 'add'
            elif line.startswith("*** Delete File:"):
                flush_file()
                current_file = line.replace("*** Delete File:", "").strip()
                action = 'delete'
            elif line.startswith("*** Rename File:"):
                flush_file()
                rename_data = line.replace("*** Rename File:", "").strip()
                if " -> " in rename_data:
                    old_path, new_path = rename_data.split(" -> ", 1)
                    current_file = (old_path.strip(), new_path.strip())
                    action = 'rename'
                else:
                    print("Error: Invalid rename syntax. Expected 'old -> new'", file=sys.stderr)
            elif line.startswith("@@"):
                flush_hunk()
            elif line.startswith("-"):
                cur_remove.append(line[1:])
            elif line.startswith("+"):
                cur_add.append(line[1:])

def apply_file_changes(filepath, action, hunks):
    # --- OPERATION: DELETE ---
    if action == 'delete':
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"Successfully deleted {filepath}")
        else:
            print(f"Warning: Cannot delete {filepath}, file does not exist.", file=sys.stderr)
        return

    # --- OPERATION: RENAME ---
    if action == 'rename':
        old_path, new_path = filepath
        if os.path.exists(old_path):
            dirname = os.path.dirname(new_path)
            if dirname:
                os.makedirs(dirname, exist_ok=True)
            os.rename(old_path, new_path)
            print(f"Successfully renamed {old_path} to {new_path}")
        else:
            print(f"Error: Cannot rename {old_path}, file does not exist.", file=sys.stderr)
        return

    # --- OPERATION: ADD ---
    if action == 'add':
        dirname = os.path.dirname(filepath)
        if dirname:
            os.makedirs(dirname, exist_ok=True)
        
        # Consolidate all additions across hunks
        content = ""
        for hunk in hunks:
            content += "\n".join(hunk["add"]) + "\n"
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully created and wrote to {filepath}")
        return

    # --- OPERATION: UPDATE ---
    if action == 'update':
        if not os.path.exists(filepath):
            print(f"Error: Cannot update {filepath}, file does not exist.", file=sys.stderr)
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        working_content = content

        try:
            for idx, hunk in enumerate(hunks):
                target_block = "\n".join(hunk["remove"])
                replacement_block = "\n".join(hunk["add"])

                if target_block in working_content:
                    # Replace exactly ONE occurrence per hunk progression
                    working_content = working_content.replace(target_block, replacement_block, 1)
                else:
                    raise RuntimeError(f"Hunk #{idx + 1} match failed. Target block context not found.")

            # Write ONLY if all hunks succeeded
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(working_content)
            print(f"Successfully patched {filepath}")

        except RuntimeError as e:
            print(f"Patch aborted for {filepath}: {e} File remains untouched.", file=sys.stderr)

if __name__ == "__main__":
    main()
