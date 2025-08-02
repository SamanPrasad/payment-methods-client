import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { client } from "../../client/client";

const PayHereSchema = z.object({
  merchant_id: z.string().min(1, "Merchant ID is required"),
  return_url: z.string(),
  cancel_url: z.string(),
  notify_url: z.string(),
  order_id: z.string(),
  items: z.string(),
  currency: z.string(),
  amount: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  hash: z.string(),
});

type PayHereType = z.infer<typeof PayHereSchema>;

function Checkout() {
  const [amount, setAmount] = useState("2000");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PayHereType>({
    defaultValues: {
      merchant_id: import.meta.env.VITE_MERCHANT_ID,
      return_url: import.meta.env.BASE_URL + "?status=return",
      cancel_url: import.meta.env.BASE_URL + "?status=cancel",
      notify_url: import.meta.env.VITE_NOTIFY_URL,
      order_id: "order12345",
      items: "Sample Item",
      currency: "LKR",
      amount: "2000",
      first_name: "Saman",
      last_name: "Prasad",
      email: "saman@gmail.com",
      phone: "0771234567",
      address: "157/A Kandy",
      city: "Kandy",
      country: "Sri Lanka",
    },
    resolver: zodResolver(PayHereSchema),
  });

  const handlePayHereSubmit: SubmitHandler<PayHereType> = async () => {
    const result = await client.post("/payhere/checkout", { amount });
    if (!result.data.hash) {
      setError("hash", { type: "manual", message: "hash cannot be empty" });
      return;
    }

    setValue("hash", result.data.hash);

    formRef.current?.submit();
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit(handlePayHereSubmit)}
        method="post"
        action="https://sandbox.payhere.lk/pay/checkout"
      >
        <div>
          <input type="hidden" {...register("merchant_id")} />
          {errors.merchant_id && (
            <h4 style={{ color: "red" }}>{errors.merchant_id.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("return_url")} />
          {errors.return_url && (
            <h4 style={{ color: "red" }}>{errors.return_url.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("cancel_url")} />
          {errors.cancel_url && (
            <h4 style={{ color: "red" }}>{errors.cancel_url.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("notify_url")} />
          {errors.notify_url && (
            <h4 style={{ color: "red" }}>{errors.notify_url.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("order_id")} />
          {errors.order_id && (
            <h4 style={{ color: "red" }}>{errors.order_id.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("items")} />
          {errors.items && (
            <h4 style={{ color: "red" }}>{errors.items.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("currency")} />
          {errors.currency && (
            <h4 style={{ color: "red" }}>{errors.currency.message}</h4>
          )}
        </div>
        <div>
          <input
            type="text"
            {...register("amount")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
            value={amount}
          />
          {errors.amount && (
            <h4 style={{ color: "red" }}>{errors.amount.message}</h4>
          )}
        </div>
        <h4>Customer Details</h4>
        <div>
          <input type="text" {...register("first_name")} />
          {errors.first_name && (
            <h4 style={{ color: "red" }}>{errors.first_name.message}</h4>
          )}
        </div>
        <div>
          <input type="text" {...register("last_name")} />
          {errors.last_name && (
            <h4 style={{ color: "red" }}>{errors.last_name.message}</h4>
          )}
        </div>
        <div>
          <input type="text" {...register("email")} />
          {errors.email && (
            <h4 style={{ color: "red" }}>{errors.email.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("phone")} />
          {errors.phone && (
            <h4 style={{ color: "red" }}>{errors.phone.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("address")} />
          {errors.address && (
            <h4 style={{ color: "red" }}>{errors.address.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("city")} />
          {errors.city && (
            <h4 style={{ color: "red" }}>{errors.city.message}</h4>
          )}
        </div>
        <div>
          <input type="hidden" {...register("country")} />
          {errors.country && (
            <h4 style={{ color: "red" }}>{errors.country.message}</h4>
          )}
        </div>
        <div>
          <input type="text" {...register("hash")} />
          {errors.hash && (
            <h4 style={{ color: "red" }}>{errors.hash.message}</h4>
          )}
        </div>
        <button type="submit">Buy Now</button>
      </form>
    </div>
  );
}

export default Checkout;
