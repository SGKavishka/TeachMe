import { useSearchParams } from "react-router-dom";
import { TutorListing } from "./TutorListing.jsx";

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const initialFilters = Object.fromEntries(searchParams.entries());
  return <TutorListing initialFilters={initialFilters} />;
};

