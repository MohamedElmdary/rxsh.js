import readline from "readline";
import ansi from "ansi-escapes";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

export abstract class Component<T extends object> {
    private __treeHeight = 0;

    constructor(protected state: T) {
        process.stdin.resume();
        process.stdin.addListener("keypress", this.onKeypress.bind(this));
        this.__render();
    }

    abstract render(): string[];
    abstract onKeypress(chunk: string, key: { name: string }): void;
    abstract getResult(): string;

    public mergeState(state: Partial<T>): void {
        this.state = { ...this.state, ...state };
        this.__render();
    }

    private __render(): void {
        this.__clear();
        const lines = this.render();
        this.__treeHeight = lines.length;
        process.stdout.write(lines.join("\n"));
    }

    private __clear() {
        process.stdout.write(ansi.eraseLines(this.__treeHeight) + "\r");
    }

    protected destroy(): void {
        this.__clear();
        process.stdout.write(this.getResult() + "\n");
        process.stdin.removeAllListeners("keypress");
        process.stdin.pause();
    }
}
