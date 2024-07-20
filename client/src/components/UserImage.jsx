import { Box } from "@mui/material";
import baseURL from "baseURL";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${baseURL}assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
