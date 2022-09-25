import { Component } from "@rxsh/base";
import chalk from "chalk";
import { Optional } from "utility-types";

interface InputState<T> {
    question: string;
    value: string;
    default: string | null;
    transform(value: string): T;
    validate(value: string): string | void;
    required: boolean;
    error: string | null | undefined | void;
}
type InputConfig<T> = Omit<
    Optional<InputState<T>, "default" | "transform" | "validate" | "required">,
    "value" | "error"
>;

export class Input<T> extends Component<InputState<T>> {
    private constructor(
        state: InputConfig<T>,
        private done: (result: T) => void
    ) {
        super({
            question: state.question,
            default: state.default || null,
            value: "",
            required: state.required || false,
            transform: state.transform || ((v) => v as T),
            validate: state.validate || (() => undefined),
            error: null
        });
    }

    render(): string[] {
        const { question, default: d, required, value, error } = this.state;
        const defaultOut = d ? ` (default: ${chalk.italic.red(d)})` : "";
        const requiredOut = required ? chalk.red(" [Required]") : "";
        const errorOut = chalk.red.italic(`(Error: ${error})`);

        return [
            `${question}${chalk.bold.red("?")}${defaultOut}${requiredOut}`,
            ...(error ? [errorOut] : []),
            value,

        ];
    }

    onKeypress(chunk: string, key: { name: string }): void {
        const { transform, value, default: d, required, validate } = this.state;

        switch (key.name) {
        case undefined:
            break;

        case "return": {
            const res = value ? value : (d ? d : "");
            const error = validate(res);

            if (error || (res === "" && required)) {
                return this.mergeState({
                    error: error || "Value is required"
                });
            }

            this.done(transform(res));
            this.destroy();
            break;
        }

        case "backspace":
            return this.mergeState({
                value: value.slice(0, value.length - 1),
                error: validate(value)
            });

        default:
            if (chunk)
                return this.mergeState({
                    value: value + chunk,
                    error: validate(value)
                });
        }
    }

    getResult(): string {
        const { question, value, default: d } = this.state;
        return `${question}${chalk.bold.red("?")} ${chalk.cyan(value || d)}`;
    }

    static create<T>(state: InputConfig<T>): Promise<T> {
        return new Promise<T>((res) => {
            new Input(state, res);
        });
    }
}
