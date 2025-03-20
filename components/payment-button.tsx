/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { toast } from "sonner";
// import { useAuth } from "@clerk/nextjs";

interface PaymentButtonProps {
  imageId: any;
  price: number;
  imageSrc: string;
}

export function PaymentButton({
  imageId,
  price,
  imageSrc,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  console.log(imageId, "imageSrc");

  // const { userId } = useAuth();

  useEffect(() => {
    console.log("imageSrc received:", imageSrc); // Debug log
    if (imageSrc) {
      setImageUrl(imageSrc);
    } else if (imageId) {
      // Try to construct a URL based on imageId if imageSrc is not provided
      const fallbackUrl = `/api/images/${imageId}`;
      console.log("Using fallback URL:", fallbackUrl); // Debug log
      setImageUrl(fallbackUrl);
    } else {
      setError("Missing image information. Cannot proceed with download.");
    }
  }, [imageSrc, imageId]);

  const downloadImage = async () => {
    try {
      console.log("Attempting to download from URL:", imageUrl); // Debug log

      if (!imageUrl) {
        throw new Error("No image URL available for download");
      }

      // Use imageUrl (not imageSrc) here
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageUrl}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update prisma download count
      try {
        await fetch("/api/images/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId }),
        });
      } catch (error) {
        console.log("Failed to update download count:", error);
      }
    } catch (error) {
      console.error("Download failed:", error);
      setError(
        `Download failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      alert("Failed to download the image. Please try again.");
    }
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount: price,
    currency: "UGX",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "user@example.com",
      phone_number: "070********",
      name: "John Doe",
    },
    customizations: {
      title: "UgPicx Image Purchase",
      description: "Payment for image on UgandaUnsplash",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!imageUrl) {
      setError("Cannot process payment: Missing image source");
      alert("Cannot process payment: Missing image source");
      return;
    }

    setIsProcessing(true);
    handleFlutterPayment({
      callback: (response) => {
        console.log("Payment response:", response);
        closePaymentModal();
        if (response.status === "successful") {
          // Set as purchased first
          setIsPurchased(true);

          toast.success("Payment successful, image will be downloaded soon.", {
            duration: 10000,
            position: "top-center",
          });

          // Download image immediately upon successful payment
          downloadImage();

          // Optional: Save purchase record to your backend
          // savePaymentToBackend(imageId, response.transaction_id);
        } else {
          alert("Payment was not successful. Please try again.");
        }
        setIsProcessing(false);
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 z-10">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {!isPurchased ? (
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !imageUrl}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Buy Now"}
        </Button>
      ) : (
        <Button
          onClick={downloadImage}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" /> Download Again
        </Button>
      )}
    </div>
  );
}
