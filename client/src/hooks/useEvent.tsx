import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchEvents,
  fetchEventById,
  fetchSavedEvents,
  fetchUserEvents,
  setFilter,
  resetFilter,
  setCurrentPage,
  selectEvents,
  selectEvent,
  selectSavedEvents,
  selectUserEvents,
  selectEventLoading,
  selectEventError,
  selectEventFilter,
  selectTotalEvents,
  selectCurrentPage,
  selectTotalPages,
} from "../app/features/eventSlice";
import type { EventFilter } from "../services/event.service";

/**
 * Custom hook để quản lý dữ liệu sự kiện
 */
const useEvent = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const events = useAppSelector(selectEvents);
  const event = useAppSelector(selectEvent);
  const savedEvents = useAppSelector(selectSavedEvents);
  const userEvents = useAppSelector(selectUserEvents);
  const isLoading = useAppSelector(selectEventLoading);
  const error = useAppSelector(selectEventError);
  const filter = useAppSelector(selectEventFilter);
  const totalEvents = useAppSelector(selectTotalEvents);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);

  // Actions
  const getEvents = useCallback(
    (newFilter?: EventFilter) => {
      if (newFilter) {
        dispatch(setFilter(newFilter));
      }
      return dispatch(fetchEvents(newFilter || filter));
    },
    [dispatch, filter]
  );

  const getEventById = useCallback(
    (id: string) => {
      return dispatch(fetchEventById(id));
    },
    [dispatch]
  );

  const getSavedEvents = useCallback(() => {
    return dispatch(fetchSavedEvents());
  }, [dispatch]);

  const getUserEvents = useCallback(() => {
    return dispatch(fetchUserEvents());
  }, [dispatch]);

  const updateFilter = useCallback(
    (newFilter: EventFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch]
  );

  const clearFilter = useCallback(() => {
    dispatch(resetFilter());
  }, [dispatch]);

  const updatePage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      dispatch(fetchEvents({ ...filter, page }));
    },
    [dispatch, filter]
  );

  return {
    // State
    events,
    event,
    savedEvents,
    userEvents,
    isLoading,
    error,
    filter,
    totalEvents,
    currentPage,
    totalPages,

    // Actions
    getEvents,
    getEventById,
    getSavedEvents,
    getUserEvents,
    updateFilter,
    clearFilter,
    updatePage,
  };
};

export default useEvent;
