import { Component } from "@rxsh/base";
import chalk from "chalk";

interface SelectState {
    question: string;
    choices: string[];
    value: number;
}
type SelectConfig = Omit<SelectState, "value" | "current">;

export class Select extends Component<SelectState> {
    private constructor(
        state: SelectConfig,
        private done: (result: number) => void
    ) {
        super({
            question: state.question,
            choices: state.choices,
            value: 0,
        });
    }

    render(): string[] {
        const { question, choices, value } = this.state;
        return [
            question + chalk.bold.red("?"),
            ...choices.map((choice, idx) => {
                return idx === value
                    ? chalk.cyan(`> ${choice}`)
                    : `  ${choice}`;
            }),
        ];
    }

    onKeypress(_: string, key: { name: string }): void {
        const { value, choices } = this.state;

        switch (key.name) {
        case "return": {
            this.done(value);
            this.destroy();
            break;
        }

        case "up": {
            if (value > 0)
                return this.mergeState({
                    value: value - 1,
                });
            break;
        }

        case "down": {
            if (value < choices.length - 1)
                return this.mergeState({
                    value: value + 1,
                });
            break;
        }
        }
    }

    getResult(): string {
        const { value, choices, question } = this.state;
        return `${question}${chalk.red.bold("?")} ${chalk.cyan(
            choices[value]
        )}`;
    }

    static create(state: SelectConfig): Promise<number> {
        return new Promise((res) => {
            new Select(state, res);
        });
    }
}
