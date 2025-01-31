import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Box, Button, Slider } from '@mui/material';
import getCroppedImg from './cropImage';

function ImageCropper({ image, onCroppedImage }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCroppedImage(croppedImage); // Pass the cropped image to the parent
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        width: '100%',
        height: '400px',
        position: 'relative',
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '300px',
          position: 'relative',
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>

      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e, newValue) => setZoom(newValue)}
        sx={{ mt: 2, width: '80%' }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleCrop}
        sx={{ mt: 2 }}
      >
        Crop and Set Avatar
      </Button>
    </Box>
  );
}

export default ImageCropper;
