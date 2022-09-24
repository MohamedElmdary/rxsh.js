import { Confirm } from "@rxsh/confirm";
import { Select } from "@rxsh/select";

async function main() {
    const result = await Confirm.create({
        question: "Are you sure you want to install these packages",
        default: true,
    });

    const version = await Select.create({
        question: "Select a package version",
        choices: ["^4.0.0", "^3.1.7", "^2.0.5", "^0.0.1-alpha"],
    });

    console.log({ result, version });
}

main();
