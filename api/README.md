# ACM Vote API

This is the backend app for the ACM Vote project.

This project follows a standard structure for Flask apps.

## Installation

1. Install pipenv and pyenv using your OS' package manager
2. Run pipenv to install the dependencies:
```bash
pipenv sync
```
3. (Only needs to be done once) Rename config_temp.py to config.py and fill in you postgres port, account, and datebase to be used
4. Run any of the provided scripts in the Pipfile. To run the testing server, use:
```bash
pipenv run server
```
