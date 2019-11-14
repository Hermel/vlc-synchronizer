const Telnet = require('telnet-client');

class VLCTelnetClient {
    constructor(port, password, ip = "127.0.0.1") {
        if (!port || !password) {
            throw new Error('should send port and password');
        }
        this.params = {
            host: ip,
            port,
            password,
            timeout: 0,
            passwordPrompt: 'Password: ',
            shellPrompt: '> '
        };
        this.connection = new Telnet();
        this.isInitialyezed = false;
    }

    async init() {
        const ready = new Promise(resolve => this.connection.on('ready', resolve));
        await this.connection.connect(this.params);
        await ready;
        this.isInitialyezed = true;
    }

    async listenToShell(onData) {
        const shell = await this.connection.shell();
        shell.on('data', (data) => onData(data.toString()))

    }

    async send(cmd) {
        if (!this.isInitialyezed) {
            throw new Error('invoke init before send');
        }
        let res = await this.connection.send(cmd, {waitfor: "> "});
        return res.replace(/\r\n> |> /g, "");
    }
}

module.exports = {VLCTelnetClient};
