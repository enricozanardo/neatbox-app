const DetailInline = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between">
    <div>{label}</div>
    <div className="text-right font-bold">{value}</div>
  </div>
);

export default DetailInline;
