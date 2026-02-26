import React from "react";
import { useParams } from "react-router-dom";
import CreateCustomer from "@/components/pos/customers/createCustomer";

export default function CustomerEditPage() {
    const { id } = useParams();
    return <CreateCustomer editId={id} />;
}
