import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Suspense } from 'react';

type EventFilter = 'all' | 'upcoming' | 'past';

async function EventsList({ filter }: { filter: EventFilter }) {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });

  if (filter === 'upcoming') {
    query = query.gte('start_date', now);
  } else if (filter === 'past') {
    query = query.lt('start_date', now);
  }

  const { data: events, error } = await query;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading events: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events && events.length > 0 ? (
        events.map((event: any) => {
          const startDate = new Date(event.start_date);
          const endDate = event.end_date ? new Date(event.end_date) : null;
          const isUpcoming = startDate > new Date();

          return (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    {event.is_featured && (
                      <span className="px-2 py-1 text-xs font-semibold bg-[color:var(--logo-pink)] text-white rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full capitalize">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {endDate && startDate.toDateString() !== endDate.toDateString() && (
                          <> - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    {isUpcoming && (
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            {filter === 'upcoming' ? 'No upcoming events' : filter === 'past' ? 'No past events' : 'No events yet'}
          </p>
          <Link
            href="/admin/events/new"
            className="inline-block bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Add Your First Event
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: EventFilter }>;
}) {
  const params = await searchParams;
  const filter = params.filter || 'all';

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-2">Events & Pop-Ups</h1>
          <p className="text-gray-600">Manage events, pop-up shops, and markets</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          + Add Event
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/admin/events"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[color:var(--logo-pink)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Events
        </Link>
        <Link
          href="/admin/events?filter=upcoming"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-[color:var(--logo-pink)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/admin/events?filter=past"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'past'
              ? 'bg-[color:var(--logo-pink)] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Past
        </Link>
      </div>

      {/* Events List */}
      <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading events...</div>}>
        <EventsList filter={filter} />
      </Suspense>
    </div>
  );
}





