"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen:boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])
    
    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Apakah anda yakin ingin menghapus?"
            description="anda harus menginputkan data ulang jika ingin data kembali."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button disabled={loading} variant="outline" onClick={onClose} className="py-2 px-4">
                    Tidak
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm} className="py-2 px-6">
                    Ya
                </Button>
            </div>

        </Modal>
    );
};