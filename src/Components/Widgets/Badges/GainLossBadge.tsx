type Props = {
  value: number;
  decimals?: number;
  upArrow?: string;
  downArrow?: string;
  greenColor?: string;
  redColor?: string;
  prefix?: string;
  postfix?: string;
};

export default function GainLossBadge({
  value,
  decimals = 2,
  upArrow = '▲',
  downArrow = '▼',
  greenColor = 'green',
  redColor = 'red',
  prefix = '',
  postfix = '',
}: Props): JSX.Element {
  const neg = value < 0;
  const disp = Math.abs(value).toFixed(decimals);
  const sign = neg ? '-' : '+';
  if (neg) {
    return (
      <div style={{ color: redColor }}>
        <span>{downArrow}</span>
        {prefix && <span>{prefix === ':sign:' ? sign : prefix}</span>}
        <span>{disp}</span>
        {postfix && <span>{postfix}</span>}
      </div>
    );
  }
  return (
    <div style={{ color: greenColor }}>
      <span>{upArrow}</span>
      {prefix && <span>{prefix}</span>}
      <span>{disp}</span>
      {postfix && <span>{postfix}</span>}
    </div>
  );
}
