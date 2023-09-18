import { Box, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";
import { AccountProfile } from "./AccountProfile";
import { AccountProfileDetails } from "./DetailProfile";
const Page = () => (
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} lg={12}>
                <AccountProfile />
              </Grid>
              <Grid xs={12} md={12} lg={12}>
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

export default Page;
