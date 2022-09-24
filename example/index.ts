import { Confirm } from "@rxsh/confirm";

async function main() {
    const result = await Confirm.create({
        question: "Are you sure you want to install these packages",
        default: true,
    });

    console.log({ result });
}

main();
