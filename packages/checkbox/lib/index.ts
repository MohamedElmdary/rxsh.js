import { Component } from "@rxsh/base";
import chalk from "chalk";
import { Optional } from "utility-types";

interface CheckboxState {
    question: string;
    choices: string[];
    required: boolean;
    default: number[];
    value: number[];
    current: number;
}
type CheckboxConfig = Omit<
    Optional<CheckboxState, "default" | "required">,
    "value" | "current"
>;

export class Checkbox extends Component<CheckboxState> {
    private constructor(
        state: CheckboxConfig,
        private done: (result: number[]) => void
    ) {
        super({
            question: state.question,
            choices: state.choices,
            required: state.required || false,
            default: state.default || [],
            value: state.default || [],
            current: 0,
        });
    }

    render(): string[] {
        const { question, choices, required, value, current } = this.state;
        const requiredOut = required ? chalk.red("[Required]") : "";

        return [
            `${question}${chalk.bold.red("?")} ${requiredOut}`,
            ...choices.map((choice, idx) => {
                const selectedOut = value.includes(idx) ? "[*]" : "[ ]";
                const out = selectedOut + ` ${choice}`;
                return current === idx ? chalk.cyan(out) : out;
            }),
        ];
    }

    onKeypress(chunk: string, key: { name: string }): void {
        const { required, value, current, choices } = this.state;

        switch (key.name) {
        case "return": {
            if (required && value.length === 0) return;

            this.done(this.state.value);
            this.destroy();
            break;
        }

        case "up": {
            if (current > 0)
                return this.mergeState({
                    current: current - 1,
                });
            break;
        }

        case "down": {
            if (current < choices.length - 1)
                return this.mergeState({
                    current: current + 1,
                });
            break;
        }

        case "space": {
            return this.mergeState({
                value: value.includes(current)
                    ? value.filter((v) => v !== current)
                    : [...value, current],
            });
        }
        }
    }

    getResult(): string {
        const { question, value, choices } = this.state;
        const valueOut = value.map((i) => choices[i]).join(", ");
        return `${question}${chalk.bold.red("?")} ${chalk.cyan(valueOut)}`;
    }

    static create(state: CheckboxConfig): Promise<number[]> {
        return new Promise<number[]>((res) => {
            new Checkbox(state, res);
        });
    }
}
