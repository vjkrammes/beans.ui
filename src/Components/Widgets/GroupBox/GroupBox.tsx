import './GroupBox.css';

type Props = {
  label: string;
  children: JSX.Element;
};

export default function GroupBox({label, children}: Props) {
  return (
    <div className="grpbox__container">
      <div className="grpbox__label">{label}</div>
      <div className="grpbox__content">{children}</div>
    </div>
  );
}
