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
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2, LucideIcon } from "lucide-react";

interface AlertProps {
  handleContinueBtn?: () => void;
  btnName?: string;
  trigerBtnVarient:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  triggerBtnClassName?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  pendingState?: boolean;
  headLine?: string;
  descLine?: string;
}

const Alert = ({
  handleContinueBtn,
  btnName,
  trigerBtnVarient,
  triggerBtnClassName,
  icon: Icon,
  iconClassName,
  pendingState=false,
  headLine,
  descLine,
}: AlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={trigerBtnVarient}
          className={triggerBtnClassName || ""}
        >
          {Icon ? <Icon className={iconClassName || ""} /> : btnName ? btnName : "Close"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{headLine ? headLine : "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {descLine ? descLine : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueBtn}>
            {pendingState ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
