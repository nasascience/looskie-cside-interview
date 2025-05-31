import { Box, Button, Flex, Spinner, TextField ,Text } from "@radix-ui/themes";
import { Suspense, useState } from "react";
import { RepoInfo } from "./RepoInfo";
import type { IIssuesSearch } from "@/interfaces/issuesSearch"; 
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";


export function RepoSearchForm() {
	const [repo, setRepo] = useState<IIssuesSearch | null>(null);
	const [input, setInput] = useState<string>("");

	 const searchSubmit =(e: React.FormEvent<HTMLFormElement>): void => {
	 	e.preventDefault();
	 	if (input.trim()) {
	 		const [owner,name] = input.trim().split("/")
	 		setRepo({owner,name});
	 	}
	 }
		  
	// );
	return (
  <Box 
    style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}
  >
    <Flex direction="column" align="center" gap="5" style={{ maxWidth: '600px', width: '100%' }}>
      <Text 
        size="7" 
        weight="bold" 
        align="center" 
        style={{ marginBottom: '1rem', color:"#eb47dd" }}
      >
        Github Repo Finder!
      </Text>
      <Text align="center" color="gray">
        Search any GitHub repository!🚀
      </Text>

      <form onSubmit={searchSubmit} style={{ width: '100%' }}>
        <Flex gap="3" align="center" justify="center" mb="5">
          <TextField.Root
            size="3"
            placeholder="e.g. facebook/react"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon width="16" height="16" />
            </TextField.Slot>
          </TextField.Root>
          
          <Button type="submit" variant="solid" size="3">
            Search
          </Button>
        </Flex>
      </form>

      {repo && (
        <Suspense fallback={<Spinner size="3" style={{ display: "block", margin: "0 auto" }} />}>
          <RepoInfo key={`${repo.owner}-${repo.name}`} owner={repo.owner} name={repo.name} />
        </Suspense>
      )}
    </Flex>
  </Box>
)
}
