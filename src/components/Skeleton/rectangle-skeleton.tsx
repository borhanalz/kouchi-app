import { Skeleton, Stack } from "@mui/material";

export default function RectangleSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" width="100%" height={100} />
      <Skeleton variant="rectangular" width="100%" height={100} />
      <Skeleton variant="rectangular" width="100%" height={100} />
    </Stack>
  );
}
