import { useState } from "react";
import type { ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";

type PasswordInputProps = Omit<ComponentProps<typeof InputGroupInput>, "type">;

export function PasswordInput(props: PasswordInputProps) {
	const [visible, setVisible] = useState(false);

	return (
		<InputGroup>
			<InputGroupInput type={visible ? "text" : "password"} {...props} />
			<InputGroupAddon align="inline-end">
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					aria-label={visible ? "Hide password" : "Show password"}
					className="text-muted-foreground hover:text-foreground"
				>
					{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
				</button>
			</InputGroupAddon>
		</InputGroup>
	);
}
