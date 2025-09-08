import { addIcons } from 'ionicons';

// Define the Rupee icon SVG 
export const rupeeOutline = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M144 128h224M144 192h224M256 384l-112-112h112c64 0 96-32 96-80s-32-64-80-64h-128"/></g></svg>';

// Register the custom icon with Ionic
addIcons({
  'rupee-outline': rupeeOutline
});

export default rupeeOutline;
