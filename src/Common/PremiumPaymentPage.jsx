/* eslint-disable react/prop-types */
import { useState } from "react";
import { Shield, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PremiumPaymentPage = ({ selectedPlan, isAnnual, onBack, onSuccess }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSuccess();
    } catch (err) {
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          ← Back to Plans
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Complete your subscription to {selectedPlan.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={paymentDetails.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={paymentDetails.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      required
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        e.target.value = formatCardNumber(e.target.value);
                        handleInputChange(e);
                      }}
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                      value={paymentDetails.expiryDate}
                      onChange={handleInputChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      required
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      maxLength={4}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${
                      isAnnual
                        ? selectedPlan.annualPrice
                        : selectedPlan.monthlyPrice
                    }`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{selectedPlan.name}</h4>
                  <p className="text-sm text-gray-500">
                    {isAnnual ? "Annual billing" : "Monthly billing"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹
                    {isAnnual
                      ? selectedPlan.annualPrice
                      : selectedPlan.monthlyPrice}
                  </p>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
              </div>

              {isAnnual && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      You save ₹
                      {(selectedPlan.monthlyPrice - selectedPlan.annualPrice) *
                        12}{" "}
                      annually
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>
                    ₹
                    {isAnnual
                      ? (selectedPlan.annualPrice * 12).toLocaleString()
                      : selectedPlan.monthlyPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {isAnnual ? "Billed annually" : "Billed monthly"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                Secure payment processing
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumPaymentPage;
