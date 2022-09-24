import { Component } from "@rxsh/base";
import { Optional } from "utility-types";
import chalk from "chalk";

interface ConfirmState {
    question: string;
    default: boolean;
    value: boolean;
}
type ConfirmConfig = Omit<Optional<ConfirmState, "default">, "value">;

export class Confirm extends Component<ConfirmState> {
    private constructor(
        state: ConfirmConfig,
        private done: (result: boolean) => void
    ) {
        super({
            question: state.question,
            default: state.default || true,
            value: state.default || true,
        });
    }

    render(): string[] {
        const { question, value } = this.state;
        let answer = chalk.cyan("Yes") + "/No";
        if (!value) {
            answer = "Yes/" + chalk.cyan("No");
        }
        return [`${question}${chalk.bold.red("?")} ${answer}`];
    }

    onKeypress(_: string, key: { name: string }): void {
        switch (key.name) {
        case "return": {
            this.done(this.state.value);
            this.destroy();
            break;
        }

        case "left": {
            return this.mergeState({
                value: true,
            });
        }

        case "right": {
            return this.mergeState({
                value: false,
            });
        }
        }
    }

    getResult(): string {
        const { question, value } = this.state;
        return `${question}${chalk.bold.red("?")} ${chalk.cyan(
            value ? "Yes" : "No"
        )}`;
    }

    static create(state: ConfirmConfig): Promise<boolean> {
        return new Promise<boolean>((res) => {
            new Confirm(state, res);
        });
    }
}
