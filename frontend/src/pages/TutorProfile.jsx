import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bookmark, CalendarDays, CheckCircle2, Clock, MapPin, MessageCircle, Monitor, School } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { Select } from "../components/common/Select.jsx";
import { RatingStars } from "../components/tutors/RatingStars.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { mockTutors } from "../mocks/tutors.js";
import { formatMoney } from "../utils/payments.js";

export const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [request, setRequest] = useState({ subject: "", topic: "", mode: "online", duration: 60, date: "", time: "", message: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.get(`/teachers/${id}`)
      .then(({ data }) => {
        setTutor(data.data.teacher);
        setReviews(data.data.reviews || []);
      })
      .catch(() => {
        const fallback = mockTutors.find((item) => item._id === id) || mockTutors[0];
        setTutor(fallback);
        setReviews([
          { _id: "r1", rating: 5, comment: "Clear lessons and practical examples.", student: { name: "Student review" } },
          { _id: "r2", rating: 4, comment: "Helpful scheduling and focused practice.", student: { name: "Recent learner" } }
        ]);
      });
  }, [id]);

  const subjects = tutor?.subjects || [];
  const selectedSubject = useMemo(() => subjects.find((item) => item.subject === request.subject) || subjects[0], [subjects, request.subject]);
  const lessonAmount = ((tutor?.pricing?.hourlyRate || 0) * Number(request.duration || 60)) / 60;
  const platformFee = lessonAmount * 0.1;
  const finalPayable = lessonAmount + platformFee;

  useEffect(() => {
    if (subjects[0] && !request.subject) {
      setRequest((current) => ({ ...current, subject: subjects[0].subject, topic: subjects[0].topics?.[0] || "" }));
    }
  }, [subjects]);

  const submitRequest = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!isAuthenticated) {
      setNotice("Please login as a student to send a learning request.");
      return;
    }

    if (user.role !== "student") {
      setNotice("Only student accounts can request classes.");
      return;
    }

    try {
      const { data } = await api.post("/bookings", {
        teacher: tutor._id,
        subject: request.subject,
        topic: request.topic,
        mode: request.mode,
        sessionDurationMinutes: Number(request.duration),
        preferredSchedule: { date: request.date, time: request.time },
        message: request.message
      });
      navigate(`/bookings/${data.data._id}/confirm`);
    } catch (err) {
      setNotice(err.response?.data?.message || "Request could not be sent.");
    }
  };

  const saveFavorite = async () => {
    if (!isAuthenticated) {
      setNotice("Please login as a student to save favorites.");
      return;
    }

    await api.post(`/favorites/${tutor._id}`).catch(() => {});
    setNotice("Favorite updated.");
  };

  if (!tutor) return <main className="page-shell grid place-items-center bg-slate-50 dark:bg-slate-950">Loading...</main>;

  const avatar = tutor.photo || tutor.user?.avatar || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";

  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img src={avatar} alt={tutor.user?.name || "Tutor"} className="h-32 w-32 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-950 dark:text-white">{tutor.user?.name}</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{tutor.headline}</p>
                  </div>
                  <Button type="button" variant="outline" onClick={saveFavorite}>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tutor.isVerified ? <Badge tone="blue"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Verified tutor</Badge> : null}
                  <Badge tone="green">{tutor.pricing?.currency || "USD"} {tutor.pricing?.hourlyRate || 0}/hr</Badge>
                  <Badge>{tutor.experienceYears || 0}+ years</Badge>
                </div>
                <div className="mt-4">
                  <RatingStars value={tutor.ratingAverage} count={tutor.ratingCount} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Teaching profile</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{tutor.bio}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <MapPin className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">Location</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{tutor.location?.city || "Remote"}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <Monitor className="h-5 w-5 text-cobalt-500" />
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">Online</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{tutor.classModes?.online ? "Available" : "Unavailable"}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <School className="h-5 w-5 text-coral-500" />
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">Physical</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{tutor.classModes?.physical ? "Available" : "Unavailable"}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {subjects.flatMap((subject) => [subject.subject, ...(subject.topics || [])]).map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Reviews</h2>
            <div className="mt-4 grid gap-3">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <RatingStars value={review.rating} />
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{review.comment}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{review.student?.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Request a session</h2>
          {notice ? <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notice}</p> : null}
          <form onSubmit={submitRequest} className="mt-5 grid gap-4">
            <Select label="Subject" value={request.subject} onChange={(event) => setRequest({ ...request, subject: event.target.value })}>
              {subjects.map((subject) => <option key={subject.subject}>{subject.subject}</option>)}
            </Select>
            <Select label="Topic" value={request.topic} onChange={(event) => setRequest({ ...request, topic: event.target.value })}>
              {(selectedSubject?.topics || []).map((topic) => <option key={topic}>{topic}</option>)}
            </Select>
            <Select label="Class mode" value={request.mode} onChange={(event) => setRequest({ ...request, mode: event.target.value })}>
              {tutor.classModes?.online ? <option value="online">Online</option> : null}
              {tutor.classModes?.physical ? <option value="physical">Offline</option> : null}
            </Select>
            <Select label="Session duration" value={request.duration} onChange={(event) => setRequest({ ...request, duration: Number(event.target.value) })}>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </Select>
            <Input icon={CalendarDays} label="Preferred date" type="date" value={request.date} onChange={(event) => setRequest({ ...request, date: event.target.value })} />
            <Input label="Preferred time" type="time" value={request.time} onChange={(event) => setRequest({ ...request, time: event.target.value })} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
              <textarea
                value={request.message}
                onChange={(event) => setRequest({ ...request, message: event.target.value })}
                className="focus-ring min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Describe what you want to learn"
              />
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 font-semibold text-slate-950 dark:text-white">
                <Clock className="h-4 w-4 text-brand-600" />
                {request.duration} minute session
              </div>
              <div className="mt-3 grid gap-2 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between gap-3"><span>Lesson</span><span>{formatMoney(lessonAmount, tutor.pricing?.currency || "USD")}</span></div>
                <div className="flex justify-between gap-3"><span>Platform fee</span><span>{formatMoney(platformFee, tutor.pricing?.currency || "USD")}</span></div>
                <div className="flex justify-between gap-3 border-t border-slate-200 pt-2 font-bold text-slate-950 dark:border-slate-800 dark:text-white">
                  <span>Total</span><span>{formatMoney(finalPayable, tutor.pricing?.currency || "USD")}</span>
                </div>
              </div>
            </div>
            <Button type="submit">Continue to booking</Button>
            <Button as={Link} to="/messages" variant="outline">
              <MessageCircle className="h-4 w-4" />
              Message tutor
            </Button>
          </form>
        </aside>
      </section>
    </main>
  );
};
