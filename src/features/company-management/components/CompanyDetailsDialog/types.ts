export interface CompanyDetailsDialogProps {
  companyId: string;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}
