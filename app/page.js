"use client";
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Button, TextField, Modal, Stack, Typography} from "@mui/material";
import { query, collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [globalQuantity, setGlobalQuantity] = useState(1);
  const [currentItem, setCurrentItem] = useState(""); 
  const [operationType, setOperationType] = useState(""); 

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, qty) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + qty });
    } else {
      await setDoc(docRef, { quantity: qty });
    }

    await updateInventory();
  };

  const removeItem = async (item, qty) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      if (currentQuantity <= qty) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: currentQuantity - qty });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName(""); 
    setGlobalQuantity(1); 
    setCurrentItem(""); 
    setOperationType(""); 
  };

  const handleOperation = (item, operation) => {
    setCurrentItem(item);
    setOperationType(operation);
    handleOpen();
  };

  const handleSubmit = () => {
    if (operationType === "add") {
      addItem(currentItem || itemName, globalQuantity);
    } else if (operationType === "remove") {
      removeItem(currentItem, globalQuantity);
    }
    handleClose();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="rgba(255, 255, 255, 0.9)"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
            backdropFilter: 'blur(5px)',
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'Titillium Web, sans-serif', color: '#005f73' }}>
            {operationType === "add" ? "Add Item" : "Remove Item"}
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            {operationType === "add" && !currentItem && (
              <TextField
                variant="outlined"
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ backgroundColor: '#fff', borderRadius: '4px' }} 
              />
            )}
            <TextField
              variant="outlined"
              type="number"
              label="Quantity"
              value={globalQuantity}
              onChange={(e) => setGlobalQuantity(Number(e.target.value))}
              sx={{ backgroundColor: '#fff', borderRadius: '4px' }} 
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ fontFamily: 'Titillium Web, sans-serif', backgroundColor: '#ff6f61', color: '#fff', '&:hover': { backgroundColor: '#ff3b2d' } }}>
              {operationType === "add" ? "Add" : "Remove"}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={() => handleOperation("", "add")}
        sx={{ fontFamily: 'Titillium Web, sans-serif', backgroundColor: '#007bff', color: '#fff', '&:hover': { backgroundColor: '#0056b3' } }}
      >
        Add New Item
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#000"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" sx={{ fontFamily: 'Titillium Web, sans-serif', color: '#fff', textTransform: 'uppercase' }}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#e0f7fa"
              padding={5}
              sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            >
              <Typography variant="h3" sx={{ fontFamily: 'Roboto, sans-serif', color: '#004d40' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: 'Roboto, sans-serif', color: '#004d40' }}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  onClick={() => handleOperation(name, "add")}
                  sx={{ fontFamily: 'Titillium Web, sans-serif', backgroundColor: '#ff6f61', color: '#fff', '&:hover': { backgroundColor: '#ff3b2d' } }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => handleOperation(name, "remove")}
                  sx={{ fontFamily: 'Titillium Web, sans-serif', backgroundColor: '#ff6f61', color: '#fff', '&:hover': { backgroundColor: '#ff3b2d' } }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
