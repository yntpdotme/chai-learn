import { Trash2 } from "lucide-react";
import { type ComponentProps, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";

export function ConfirmDeleteDialog({
	title,
	description,
	onConfirm,
	trigger,
}: {
	title: string;
	description: string;
	onConfirm: () => void | Promise<void>;
	trigger?: ComponentProps<typeof AlertDialogTrigger>["render"];
}) {
	const [open, setOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					trigger ?? (
						<Button
							variant="ghost"
							size="icon"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive"
							onClick={(e) => e.stopPropagation()}
						>
							<Trash2 className="size-4" />
						</Button>
					)
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={(e) => e.stopPropagation()}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={deleting}
						onClick={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							setDeleting(true);
							try {
								await onConfirm();
								setOpen(false);
							} finally {
								setDeleting(false);
							}
						}}
					>
						{deleting ? "Deleting…" : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
