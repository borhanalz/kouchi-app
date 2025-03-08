import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ChatSkeleton=()=>{
return <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: 2,
    p: 2,
  }}
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="text" width={100} height={30} />
  </Box>

  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
    {/* Incoming Message Skeleton */}
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={200} height={80} />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
      <Skeleton variant="rectangular" width={200} height={80} />
      <Skeleton variant="circular" width={40} height={40} />
    </Box>

    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={200} height={80} />
    </Box>
  </Box>

  <Box mt={28} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={50} />
    <Skeleton variant="circular" width={40} height={40} />
  </Box>
</Box>
}
export default ChatSkeleton;
