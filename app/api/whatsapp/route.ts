import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_MY_NUMBER;

const client = new Twilio(accountSid, authToken);

async function kirimPesanWhatsApp(nomorPenerima: string, pesan: string) {
  try {
    const message = await client.messages.create({
      body: pesan,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${nomorPenerima}`,
    });

    console.log(`Pesan berhasil dikirim. SID: ${message.sid}`);
  } catch (error) {
    console.error(`Terjadi kesalahan: ${error}`);
  }
}

// Contoh penggunaan
const nomorPelanggan = '+6285875472557'; // Gantilah dengan nomor pelanggan yang sebenarnya
const pesanStatusPesanan = 'Halo! Pesanan Anda dengan nomor #123 sedang diproses.'; // Sesuaikan dengan pesan yang diinginkan

kirimPesanWhatsApp(nomorPelanggan, pesanStatusPesanan);
