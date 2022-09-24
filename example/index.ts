import { Confirm } from "@rxsh/confirm";
import { Select } from "@rxsh/select";
import { Checkbox } from "@rxsh/checkbox";

async function main() {
    const result = await Confirm.create({
        question: "Are you sure you want to install these packages",
        default: true,
    });

    const version = await Select.create({
        question: "Select a package version",
        choices: ["^4.0.0", "^3.1.7", "^2.0.5", "^0.0.1-alpha"],
    });

    const packages = await Checkbox.create({
        question: "Select package to install",
        choices: [
            "bip39",
            "grid3_client",
            "@angular/cli",
            "create-react-app",
            "ts-node",
            "rxsh",
        ],
        required: true,
    });

    console.log({ result, version, packages });
}

main();
