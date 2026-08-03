
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  CheckCircle,
  CircleOff,
  CopyPlus,
  Download,
  Edit,
  Fuel,
  Eye,
  FileText,
  Key,
  Link2,
  Mails,
  MapPin,
  Printer,
  Receipt,
  RefreshCcw,
  Save,
  Settings,
  Trash,
  Upload,
  XCircle,
} from "lucide-react";

const styles: Record<string, any> = {
  view: {
    color: "text-blue-600",
    hoverColor: "hover:text-blue-700",
    border: "border-blue-500",
    hoverBorder: "hover:border-blue-600",
    bg: "hover:bg-teal-50",
    icon: Eye,
  },
  edit: {
    color: "text-teal-600",
    hoverColor: "hover:text-teal-700",
    border: "border-teal-500",
    hoverBorder: "hover:border-teal-600",
    bg: "hover:bg-teal-50",
    icon: Edit,
  },
  link: {
    color: "text-blue-600",
    hoverColor: "hover:text-blue-700",
    border: "border-blue-500",
    hoverBorder: "hover:border-blue-600",
    bg: "hover:bg-blue-50",
    icon: Link2,
  },
  copy: {
    color: "text-indigo-600",
    hoverColor: "hover:text-indigo-700",
    border: "border-indigo-500",
    hoverBorder: "hover:border-indigo-600",
    bg: "hover:bg-indigo-50",
    icon: CopyPlus,
  },
  delete: {
    color: "text-red-600",
    hoverColor: "hover:text-red-700",
    border: "border-red-500",
    hoverBorder: "hover:border-red-600",
    bg: "hover:bg-red-50",
    icon: Trash,
  },
  download: {
    color: "text-purple-600",
    hoverColor: "hover:text-purple-700",
    border: "border-purple-500",
    hoverBorder: "hover:border-purple-600",
    bg: "hover:bg-purple-50",
    icon: Download,
  },
  upload: {
    color: "text-purple-600",
    hoverColor: "hover:text-purple-700",
    border: "border-purple-500",
    hoverBorder: "hover:border-purple-600",
    bg: "hover:bg-purple-50",
    icon: Upload,
  },
  save: {
    color: "text-green-600",
    hoverColor: "hover:text-green-700",
    border: "border-green-500",
    hoverBorder: "hover:border-green-600",
    bg: "hover:bg-green-50",
    icon: Save,
  },
  cancel: {
    color: "text-red-600",
    hoverColor: "hover:text-red-700",
    border: "border-red-500",
    hoverBorder: "hover:border-red-600",
    bg: "hover:bg-red-50",
    icon: CircleOff,
  },
  setting: {
    color: "text-amber-600",
    hoverColor: "hover:text-amber-700",
    border: "border-amber-500",
    hoverBorder: "hover:border-amber-600",
    bg: "hover:bg-amber-50",
    icon: Settings,
  },
  register: {
    color: "text-rose-600",
    hoverColor: "hover:text-rose-700",
    border: "border-rose-500",
    hoverBorder: "hover:border-rose-600",
    bg: "hover:bg-rose-50",
    icon: FileText,
  },
  receipt: {
    color: "text-sky-600",
    hoverColor: "hover:text-sky-700",
    border: "border-sky-500",
    hoverBorder: "hover:border-sky-600",
    bg: "hover:bg-sky-50",
    icon: Receipt,
  },
  "reset-password": {
    color: "text-sky-600",
    hoverColor: "hover:text-sky-700",
    border: "border-sky-500",
    hoverBorder: "hover:border-sky-600",
    bg: "hover:bg-sky-50",
    icon: Key,
  },
  purchases: {
    color: "text-sky-600",
    hoverColor: "hover:text-sky-700",
    border: "border-sky-500",
    hoverBorder: "hover:border-sky-600",
    bg: "hover:bg-sky-50",
    icon: FileText,
  },
  mail: {
    color: "text-sky-600",
    hoverColor: "hover:text-sky-700",
    border: "border-sky-500",
    hoverBorder: "hover:border-sky-600",
    bg: "hover:bg-sky-50",
    icon: Mails,
  },
  refresh: {
    color: "text-orange-600",
    hoverColor: "hover:text-orange-700",
    border: "border-orange-500",
    hoverBorder: "hover:border-orange-600",
    bg: "hover:bg-orange-50",
    icon: RefreshCcw
  },
  accept: {
    color: "text-green-600",
    hoverColor: "hover:text-green-700",
    border: "border-green-500",
    hoverBorder: "hover:border-green-600",
    bg: "hover:bg-green-50",
    icon: CheckCircle,
  },
  reject: {
    color: "text-red-600",
    hoverColor: "hover:text-red-700",
    border: "border-red-500",
    hoverBorder: "hover:border-red-600",
    bg: "hover:bg-red-50",
    icon: XCircle,
  },
  printer: {
    color: "text-gray-600",
    hoverColor: "hover:text-gray-700",
    border: "border-gray-500",
    hoverBorder: "hover:border-gray-600",
    bg: "hover:bg-gray-50",
    icon: Printer,
  },
  location: {
    color: "text-blue-600",
    hoverColor: "hover:text-blue-700",
    border: "border-blue-500",
    hoverBorder: "hover:border-blue-600",
    bg: "hover:bg-blue-50",
    icon: MapPin,
  },
  convert: {
    color: "text-amber-600",
    hoverColor: "hover:text-amber-700",
    border: "border-amber-500",
    hoverBorder: "hover:border-amber-600",
    bg: "hover:bg-amber-50",
    icon: ArrowLeftRight,
  },
  fuel: {
    color: "text-orange-600",
    hoverColor: "hover:text-orange-700",
    border: "border-orange-500",
    hoverBorder: "hover:border-orange-600",
    bg: "hover:bg-orange-50",
    icon: Fuel,
  },

};

interface ActionButtonProps {
  type:
  | "view"
  | "link"
  | "edit"
  | "copy"
  | "delete"
  | "download"
  | "upload"
  | "save"
  | "cancel"
  | "setting"
  | "register"
  | "receipt"
  | "reset-password"
  | "purchases"
  | "mail"
  | "pdf"
  | "excel"
  | "refresh"
  | "accept"
  | "reject"
  | "printer" | "location" | "convert" | "fuel";

  isLoading?: boolean;
  onClick: () => void;
  title?: string;
  disabled?: boolean;
  buttonType?: "button" | "submit" | "reset";
  "aria-disabled"?: boolean;
  "aria-label"?: string;
}

const ActionButton = ({
  type,
  title = "",
  onClick,
  buttonType = "button",
  isLoading = false,
  ...props
}: ActionButtonProps) => {
  const {
    color,
    hoverColor,
    border,
    hoverBorder,
    bg,
    icon: Icon,
  } = styles[type];

  return (
    <Button
      type={buttonType}
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`h-7 w-7 min-w-7 p-0 ${border} ${hoverBorder} ${color} ${hoverColor} ${bg}`}
      title={title}
      {...props}
      loading={isLoading}
    >
      {!isLoading && < Icon className="h-4 w-4" />}
    </Button>
  );
};

export default ActionButton;