function useFormattedDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}
export default useFormattedDate;
