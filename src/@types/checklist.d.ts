type CheckListNodeType = {
  q: string;
  children: CheckListNodeType[];
  isRequired: boolean;
  isChecked: boolean;
};
