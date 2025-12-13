import { useToast } from "@/Components/ui/use-toast"; // Mengimpor useToast

export default function BankSettingsPage({ bankDetails }) {
  const { toast } = useToast();  // Mendapatkan fungsi toast

  const submit = (e) => {
    e.preventDefault();

    // Kirim request atau update data di sini
    toast.success("Pengaturan Rekening Berhasil Diperbarui!");
  };

  return (
    <form onSubmit={submit}>
      <button type="submit">Simpan Perubahan</button>
    </form>
  );
}
