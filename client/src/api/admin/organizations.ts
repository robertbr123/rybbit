import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { authedFetchWithError } from "../utils";

export type UserOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  metadata: string | null;
  role: string;
};

export function getUserOrganizations(): Promise<UserOrganization[]> {
  return authedFetchWithError(`${BACKEND_URL}/user/organizations`);
}

export function useUserOrganizations() {
  return useQuery({
    queryKey: ["userOrganizations"],
    queryFn: getUserOrganizations,
  });
}
