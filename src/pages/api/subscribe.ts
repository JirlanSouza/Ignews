import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";

import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async function Subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      const session = await getSession({ req: request });

      const user = await fauna.query<User>(
        q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
      );

      let custumerId = user.data.stripe_customer_id;

      if (!custumerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email,
        });

        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), user.ref.id), {
            data: {
              stripe_customer_id: stripeCustomer.id,
            },
          })
        );

        custumerId = stripeCustomer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: custumerId,
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [{ price: "price_1JqIPrL62Qz0xxFhf1GhW9yd", quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });

      return response.status(200).json({ sessionId: stripeCheckoutSession.id });
    } catch (err) {
      console.log(err);

      response.status(500).end();
    }
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allownd");
  }
}
