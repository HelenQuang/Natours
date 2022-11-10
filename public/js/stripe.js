import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51M2FkpKqYgN7plwfXGYGclHRCcp11KI6RtW5poT8ePsQjbCP1bU38PO9sdmLyxNJ9jjChIYbZkRWPps3Ng7Rm05m00sd2HaT6Vs"
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert("error", err.message);
  }
};
