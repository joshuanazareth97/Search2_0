import { SearchSharp } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import questionImg from "../../assets/images/question.png";
import { request } from "../../config/axios";

type Props = {};

const QuestionImage = styled("img")`
  width: 25%;
  margin-bottom: 4rem;
`;

const Search = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setAnswer("");
    const result = await request.post("/users/query", {
      query: searchTerm,
    });
    setLoading(false);
    setAnswer(result.data.answers?.choices?.[0]?.text || "");
  }, [searchTerm, setSearchTerm, answer, setAnswer]);

  return (
    <>
      <QuestionImage src={questionImg} />
      <TextField
        placeholder="Ask me anything"
        variant="filled"
        hiddenLabel
        sx={{
          alignSelf: "stretch",
          flexGrow: "1",
          "& input": {
            fontSize: "1.25rem",
            fontWeight: "bold",
          },
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLoading(false);
          setAnswer("");
          setSearchTerm(event.target.value);
        }}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleSearch}
                edge="end"
                // color="primary"
              >
                <SearchSharp />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: "2",
          alignSelf: "stretch",
        }}
      >
        {loading && (
          <CircularProgress
            color="primary"
            size="6rem"
            sx={{
              alignSelf: "center",
            }}
          />
        )}
        {answer && (
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {answer}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Search;
