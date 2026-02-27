import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Registrant } from '../backend';

// ─── TRS Registrants ──────────────────────────────────────────────────────────

export function useGetTotalRegistrants() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['totalRegistrants'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalRegistrants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRegistrants() {
  const { actor, isFetching } = useActor();
  return useQuery<Registrant[]>({
    queryKey: ['allRegistrants'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsRegistered(phoneNumber: string) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isRegistered', phoneNumber],
    queryFn: async () => {
      if (!actor || !phoneNumber) return false;
      return actor.isRegistered(phoneNumber);
    },
    enabled: !!actor && !isFetching && !!phoneNumber,
  });
}
