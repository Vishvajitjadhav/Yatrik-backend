# API Contract

Base path: `/api/v1` · Auth: `Authorization: Bearer <jwt>` · Envelope: `{ timeStamp, data, error }`

## Auth  *(public)*
| Method | Path | Body | Returns |
|--------|------|------|---------|
| POST | `/auth/signup` | `{ name, email, password, roles?[] }` | `201 { token, user }` |
| POST | `/auth/login` | `{ email, password }` | `200 { token, user }` |
| GET | `/auth/me` | — (Bearer token) | `{ id, name, email, roles[] }` |

- `roles` is **optional** on signup; omit it to register a `GUEST`. Pass `["HOTEL_MANAGER"]` to create a manager.
- `user` = `{ id, name, email, roles[] }`. `token` is a JWT (subject = user id, 10 h expiry) — send as `Authorization: Bearer <token>`.

## Browse *(public)*
| Method | Path | Body / Query | Returns |
|--------|------|--------------|---------|
| POST | `/hotels/search` | `{ city, startDate, endDate, roomsCount, page?, size? }` | `Page<HotelPriceDto>` |
| GET | `/hotels/{id}/info` | — | `HotelInfoDto { hotel, rooms[] }` |

> ✅ Phase 0: search is now **`POST`** (was `GET` with a request body, which browsers can't send).

## Booking *(GUEST, auth required)*
| Method | Path | Body | Returns |
|--------|------|------|---------|
| POST | `/bookings/init` | `{ hotelId, roomId, checkInDate, checkOutDate, roomsCount }` | `BookingDto` |
| POST | `/bookings/{id}/addGuests` | `GuestsDto[]` `{ name, gender, age }` | `BookingDto` |
| POST | `/bookings/{id}/payments` | — | `{ sessionUrl }` (Stripe redirect) |
| POST | `/bookings/{id}/cancel` | — | `204` (triggers refund) |
| GET | `/bookings/{id}/status` | — | `{ bookingStatus }` |
| GET | `/bookings` | — | `BookingDto[]` (my bookings, newest first) |

> Stripe is optional in dev: with no `stripe.secretKey`, `/payments` returns the success URL and stamps a
> placeholder session id (no real charge). See [setup.md](setup.md).

**BookingStatus:** `RESERVED → GUEST_ADDED → PAYMENTS_PENDING → CONFIRMED / CANCELLED / EXPIRED`
(A reservation expires 10 min after creation.)

> **Frontend flow notes (Phase 3):**
> - After Stripe checkout the backend redirects the browser to `{frontend.url}/payments/{bookingId}/status`
>   for **both** success and failure, so the SPA owns that route and polls `GET /bookings/{id}/status`.
>   Confirmation itself is applied server-side by the Stripe **webhook**, not the redirect — in dev
>   no-op mode (no Stripe keys) the booking therefore stays `PAYMENTS_PENDING` until a webhook fires.
> - `cancel` only succeeds on a `CONFIRMED` booking (refund path).
> - ⚠️ Gap: `BookingDto` carries **no hotel/room reference**, so "My Trips" can't show the hotel name
>   from `GET /bookings` alone. Candidate backend enrichment (add `hotel`/`room` summary to the DTO).

## Hotel Manager *(HOTEL_MANAGER, auth required)*
| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/admin/hotels` | — | `HotelDto[]` (my hotels) |
| POST | `/admin/hotels` | `HotelDto` | `HotelDto` (201) |
| GET | `/admin/hotels/{id}` | — | `HotelDto` |
| PUT | `/admin/hotels/{id}` | `HotelDto` | `HotelDto` |
| DELETE | `/admin/hotels/{id}` | — | `204` |
| PATCH | `/admin/hotels/{id}/activate` | — | `204` |
| POST | `/admin/hotels/{id}/rooms` | `RoomDto` | `RoomDto` (201) |
| GET | `/admin/hotels/{id}/rooms` | — | `RoomDto[]` |
| GET | `/admin/hotels/{id}/rooms/{roomId}` | — | `RoomDto` |
| DELETE | `/admin/hotels/{id}/rooms/{roomId}` | — | `204` |

> **Frontend flow notes (Phase 4):**
> - `GET/POST/PUT/DELETE /admin/hotels*` are **owner-scoped** — the list and every mutation act only
>   on hotels owned by the signed-in manager. New hotels start `active:false` (draft).
> - `PATCH /activate` sets `active:true` **and generates a year of inventory** for every room — so
>   add rooms before publishing. It only activates; there is **no deactivate endpoint**, so the UI
>   "Unpublish" sends `PUT /admin/hotels/{id}` with `active:false`.
> - Creating a room on an already-active hotel generates that room's inventory immediately.
> - ⚠️ Gap: no bookings/occupancy **report endpoint** — the manager Overview aggregates the hotels
>   and rooms it can read; revenue/occupancy analytics await a backend report API (roadmap 6b).

## Stripe webhook *(public, signature-verified)*
| Method | Path | Body | Returns |
|--------|------|------|---------|
| POST | `/webhook/payment` | raw Stripe event (+ `Stripe-Signature` header) | `204` / `400` |

> No JWT — authenticity comes from the Stripe signature. With no `stripe.webhookSecret` configured
> the endpoint acknowledges and ignores the event (dev no-op).

## Key DTO shapes
```
HotelDto      { id, name, city, photos[], amenities[], contactInfo{address,location,email,phoneNumber}, active }
RoomDto       { id, type, basePrice, photos[], amenities[], totalCount, capacity }
HotelPriceDto { hotel, price }
HotelInfoDto  { hotel, rooms[] }
BookingDto    { id, roomsCount, checkInDate, checkOutDate, bookingStatus, guests[], amount, createdAt }
GuestsDto     { id, name, gender(MALE|FEMALE|OTHER), age }
UserDto       { id, name, email, roles[] }
LoginResponse { token, user: UserDto }
```
