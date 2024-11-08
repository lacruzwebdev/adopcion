type Props = {
  type: "error" | "success";
  message: string;
};

export default function Alert({ type, message }: Props) {
  const styles = {
    error: "bg-destructive/20 text-destructive",
    success: "bg-green-500/20 text-green-600",
  };
  console.log({ type, message });
  return (
    <div className="w-full pt-5">
      <div className={`rounded px-3 py-2 ${styles[type]}`}>
        <svg
          className="mr-2 inline h-3 w-3 shrink-0 fill-current"
          viewBox="0 0 12 12"
        >
          <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
        </svg>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
