import { Confirm, Checkbox, Select, Input } from "@rxsh/core";

async function main() {
    // const result = await Confirm.create({
    //     question: "Are you sure you want to install these packages",
    //     default: true,
    // });

    // const version = await Select.create({
    //     question: "Select a package version",
    //     choices: ["^4.0.0", "^3.1.7", "^2.0.5", "^0.0.1-alpha"],
    // });

    // const packages = await Checkbox.create({
    //     question: "Select package to install",
    //     choices: [
    //         "bip39",
    //         "grid3_client",
    //         "@angular/cli",
    //         "create-react-app",
    //         "ts-node",
    //         "rxsh",
    //     ],
    //     required: true,
    // });

    const username = await Input.create({
        question: "Github user name",
        default: "MohamedElmdary",
        required: true,
        transform: (value) => "@" + value,
        validate: (value) => {
            if (value.length < 6) return "Username min length is 6";
        }
    });

    console.log({ username });

    // console.log({ result, version, packages, username });
}

main();
