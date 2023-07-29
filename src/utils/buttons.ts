import { Button, ButtonExec } from "../types/buttons";

export function button(id: string, exec: ButtonExec): Button {
    return {
        id,
        exec
    }
}