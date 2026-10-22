## Prohibited Behaviors

1. **Without permission**, it is prohibited to perform read and write operations on hard drives outside the scope of this project and its derived WorkTree.
2. **Without permission**, additional content is prohibited from being installed.
3. **Without permission**, it is prohibited to modify existing branches in the project's GIT repository.

## Environment

1. Under normal circumstances, the corresponding environment and variables should be obtained through the command line.
2. If the command line cannot obtain them, the `E:` directory can be checked. The nature of this directory is read-only.
3. If the available environment still cannot be provided, the user should be requested for a solution.

## Implementation of Plans and Strategies

1. Prioritize creating a `plan.md` file in the root directory's `.agent` folder to store the plan.
2. Store the detailed plans of the modules or similar module concepts in the directory `/.agent/plan-xx/yyy.md`. At the same time, add the corresponding index in the `/.agent/plan.md` file. For the main plan `/.agent/plan.md`, present the modules and important nodes in a brief overview and provide the index for each sub-plan.
3. During the alternate version of the plan, after organizing the old version plans, move the non-main plan files of the old version to the `/.agent/plan.v{x}-archive/` directory and rename `/.agent/plan.md` to `/.agent/plan.v{x}.md`. Update `/.agent/plan.v{x + 1}.md` file.
4. During the normal iteration of the plan, reduce the reading of complex modules' code and instead read the main plan file or sub-plan files to quickly index to the specific code.

## Within the Project

1. AI-generated content should be uniformly stored in the root directory's `.agent` folder. Temporary files should be cleared promptly after they are no longer needed.
2. Before generating, modifying or deleting project files, consider the current status of the `.gitignore` file. For example, according to the first point of this section, the `.agent` directory should be excluded.
3. When the implementation progress of the coding plan in the project reaches an important milestone, consult the user for review and test feedback, and update the `README.md` file as needed.

### Special Note

1. If the project includes the tauri2 library, do not run the `tauri build` command to build the application before reaching the final output stage; instead, use tools such as `tsc` or `cargo check` to perform semantic checks on TypeScript/Rust code.
2. File operations: During the project planning stage, first confirm whether a dedicated MCP tool has been added to the project and record the corresponding name (if applicable) in the plan file. Otherwise, use the PowerShell 7 environment to support UTF-8 encoding.

## Coding Habits

1. During the coding process, first consider obtaining the configuration files for the formatting tools of the corresponding language, such as `.prettierrc`, `.eslintrc`, `.stylelintrc`, etc., to ensure the consistency of the code style.
2. When writing code, one should avoid overusing comments. That is, comments should only be provided for members with high coupling levels and complex business logic, etc., in cases where it is necessary.
