import React, { useState, useEffect } from "react";
import {
  Box,
  Img,
  Text,
  IconButton,
  Spinner,
  Center,
  VStack,
  Skeleton,
  AspectRatio,
  useClipboard,
  Button,
} from "@chakra-ui/react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineSortDescending,
  AiOutlineSortAscending,
} from "react-icons/ai";
import { FaClipboard } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Index = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [loadFail, setFail] = useState<boolean>(false);
  const [likes, setLikes] = useState<Array<any>>(() => {
    let savedLikes =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("likes"))
        : [] || [];
    return savedLikes;
  });
  const [sortRecent, setSort] = useState<boolean>(false);
  const [copyText, setCopy] = useState<string>();
  const { hasCopied, onCopy } = useClipboard(copyText);

  useEffect(() => {
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.GATSBY_NASA_API}&start_date=2021-12-01`
    )
      .then((res) => res.json())
      .then((vals) => {
        setData(vals);
      })
      .catch((e) => setFail(true));
  }, []);
  useEffect(() => {
    likes ? localStorage.setItem("likes", JSON.stringify(likes)) : null;
  }, [likes]);
  useEffect(() => {
    setData([...data.reverse()]);
  }, [sortRecent]);
  useEffect(() => {
    copyText ? onCopy() : null;
  }, [copyText]);
  return (
    <Box bg={"#f5f5f5"} minH={"100vh"}>
      <Helmet title={"Spacestagram"} />
      <Center>
        <Text fontWeight={"bold"} mt={5} fontSize={"1.5em"}>
          Spacestagram
        </Text>
      </Center>
      <Center>
        <Text mx={2}>
          Powered by the NASA Astronomy Photo of The Day (AOPD) API
        </Text>
      </Center>
      <Center>
        {data != null && data[0] ? (
          <Button
            m={2}
            onClick={() => setSort(!sortRecent)}
            colorScheme={"whiteAlpha"}
            color={"black"}
            variant={"outline"}
            rightIcon={
              sortRecent ? (
                <AiOutlineSortDescending />
              ) : (
                <AiOutlineSortAscending />
              )
            }
          >
            Sort by {sortRecent ? "most recent" : "oldest"}
          </Button>
        ) : (
          <></>
        )}
      </Center>
      {data != null && data[0] ? (
        data.map((item, index) => (
          <Center key={"center-" + index}>
            <VStack
              key={"stack-" + index}
              bg={"#ffffff"}
              m={5}
              py={5}
              borderRadius={5}
              px={2}
            >
              <Box h={"auto"} px={5}>
                {item.media_type == "image" ? (
                  <Img
                    src={item.url}
                    key={"image-" + index}
                    borderRadius={"md"}
                    objectFit={"cover"}
                    alt={item.title}
                    alignSelf={"center"}
                    fallback={<Skeleton />}
                  />
                ) : (
                  <AspectRatio
                    width={{ base: "70vw", md: "30vw" }}
                    height={"auto"}
                  >
                    <iframe
                      src={item.url}
                      title={"Playable content: " + item.title}
                    />
                  </AspectRatio>
                )}
              </Box>
              <Text fontWeight={"semibold"} key={"title-" + index} mx={"auto"}>
                {item.title}
              </Text>
              <Text key={"date-" + index}>{item.date}</Text>
              <IconButton
                key={"button-" + index}
                bg={"white"}
                color={"red"}
                size={"lg"}
                fontSize={"2em"}
                variant={likes.includes(item.url) ? "solid" : "ghost"}
                aria-label={"Like image" + item.title}
                _active={{
                  bg: "red",
                  transform: "scale(0.98)",
                  borderColor: "red",
                }}
                icon={
                  likes.includes(item.url) ? (
                    <AiFillHeart />
                  ) : (
                    <AiOutlineHeart />
                  )
                }
                onClick={() =>
                  likes.includes(item.url)
                    ? setLikes(likes.filter((item) => item.name !== item.url))
                    : setLikes([...likes, item.url])
                }
              />
              <Button
                leftIcon={<FaClipboard />}
                colorScheme={"whiteAlpha"}
                color={"black"}
                variant={"outline"}
                onClick={() => setCopy(item.url)}
              >
                Copy Link
              </Button>
            </VStack>
          </Center>
        ))
      ) : (
        <Center>
          <Spinner mt={"40vh"} size={"xl"} />
        </Center>
      )}
    </Box>
  );
};

export default Index;
