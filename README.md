# Portal

Portal is a peer-to-peer library and standalone executable designed to
make peer-to-peer networking more accessible.

## Downloads

### Direct downloads

* [All releases](https://github.com/sogouda/portal/releases)
* [Latest release](https://github.com/sogouda/portal/releases/latest)

### npm *(Node Package Manager)*

```sh
npm i -g @sogouda/portal
```

## Usage

Replace `portal` in the following commands with the name of your `portal` executable.

Operating system | Executable name
---------------- | ---------------
Linux            | `portal`
Windows          | `portal.exe`
Mac / OS X       | `portal-osx`

### Host a server

Run the following command *(replace `25565` with the port number of your server)*.

```sh
portal port host -p 25565
```

You'll see output similar to the following:

```json
{"publicKey":"ed8d689b12d2a1998e7f284c16031bcb89cec5065c84e206975eebee438caf95"}
```

Copy the public key in between the parenthesis *(in this case, `ed8d689b12d2a1998e7f284c16031bcb89cec5065c84e206975eebee438caf95`)*.
Send this code to your friend.
This is the code that your friend will need to paste in the following steps for [joining a server](#join-a-server).

### Join a server

Run the following command *(replace `ed8d689b12d2a1998e7f284c16031bcb89cec5065c84e206975eebee438caf95` with [the public key of your server](#host-a-server))*.

```sh
portal port join -p 25565 ed8d689b12d2a1998e7f284c16031bcb89cec5065c84e206975eebee438caf95
```

This will output a JSON string containing the connection details.
