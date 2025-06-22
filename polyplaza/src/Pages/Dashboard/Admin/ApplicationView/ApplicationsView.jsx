import { useState, useEffect } from "react"
import AdminNavBar from "../AdminNavBar"
import { Check, X, Clock, User, Calendar, FileText, ExternalLink, Phone, Mail, Store, MapPin } from "lucide-react"
import { supabase } from "../../../../supabase"

function ApplicationsView() {
  const [activeTab, setActiveTab] = useState("pending")
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch applications from database
  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("seller_application")
        .select(`
          application_id,
          seller_name,
          application_date,
          valid_id_url,
          status,
          address_id,
          buyer:buyer_id (
            buyer_id,
            first_name,
            last_name,
            email,
            phone
          ),
          address:address_id (
            address_id,
            street,
            city,
            postal_code
          )
        `)
        .order("application_date", { ascending: false })

      if (error) {
        throw error
      }

      // For approved applications, fetch seller data separately
      const applicationsWithSellers = await Promise.all(
        data.map(async (app) => {
          if (app.status === "Approved") {
            const { data: sellerData } = await supabase
              .from("seller")
              .select("seller_id, applied_at")
              .eq("application_id", app.application_id)
              .single()

            return {
              ...app,
              seller_info: sellerData,
            }
          }
          return app
        }),
      )

      setApplications(applicationsWithSellers || [])
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAccept = async (application) => {
    try {
      // Start a transaction-like operation
      const { error: updateError } = await supabase
        .from("seller_application")
        .update({ status: "Approved" })
        .eq("application_id", application.application_id)

      if (updateError) {
        throw updateError
      }

      // Create seller record
      const { data: sellerData, error: sellerError } = await supabase
        .from("seller")
        .insert({
          buyer_id: application.buyer.buyer_id,
          address_id: application.address_id,
          seller_name: application.seller_name,
          application_id: application.application_id,
        })
        .select()

      if (sellerError) {
        // Rollback the status update if seller creation fails
        await supabase
          .from("seller_application")
          .update({ status: "Pending" })
          .eq("application_id", application.application_id)

        throw sellerError
      }

      // Update local state with approval date
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === application.application_id
            ? {
                ...app,
                status: "Approved",
                seller_info: sellerData[0]
                  ? {
                      seller_id: sellerData[0].seller_id,
                      applied_at: sellerData[0].applied_at,
                    }
                  : null,
              }
            : app,
        ),
      )

      alert("Application approved successfully!")
    } catch (err) {
      console.error("Error accepting application:", err)
      alert(`Failed to approve application: ${err.message}`)
    }
  }

  const handleReject = async (applicationId) => {
    try {
      const { error } = await supabase
        .from("seller_application")
        .update({ status: "Rejected" })
        .eq("application_id", applicationId)

      if (error) {
        throw error
      }

      // Update local state with current timestamp as rejection date
      const rejectionDate = new Date().toISOString()
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === applicationId ? { ...app, status: "Rejected", rejection_date: rejectionDate } : app,
        ),
      )

      alert("Application rejected successfully!")
    } catch (err) {
      console.error("Error rejecting application:", err)
      alert(`Failed to reject application: ${err.message}`)
    }
  }

  const filteredApplications = applications.filter((app) => {
    switch (activeTab) {
      case "pending":
        return app.status === "Pending"
      case "approved":
        return app.status === "Approved"
      case "rejected":
        return app.status === "Rejected"
      default:
        return true
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = (address) => {
    if (!address) return "Address not provided"
    const parts = [address.street, address.city, address.postal_code].filter(Boolean)
    return parts.join(", ")
  }

  const getApplicationCounts = () => {
    return {
      pending: applications.filter((app) => app.status === "Pending").length,
      approved: applications.filter((app) => app.status === "Approved").length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
    }
  }

  const counts = getApplicationCounts()

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen">
        <AdminNavBar />
        <div className="p-20 bg-neutral-50 pt-20 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-neutral-200 rounded w-48 mb-4 mx-auto"></div>
                  <div className="h-4 bg-neutral-200 rounded w-32 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen min-w-screen">
        <AdminNavBar />
        <div className="p-20 bg-neutral-50 pt-20 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="bg-white rounded-3xl shadow-sm p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error Loading Applications</h3>
                <p className="text-neutral-600 mb-6">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-screen">
      <AdminNavBar />
      <div className="p-20 bg-neutral-50 pt-20 text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-neutral-900">Seller Applications</h1>
            </div>
            <p className="text-neutral-600">Review and manage seller applications</p>
          </div>

          <div className="space-y-6">
            {/* Horizontal Navigation */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
              <div className="flex border-b border-neutral-200 -mx-6 -mt-6 mb-6">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`flex-1 px-6 py-4 text-center font-medium rounded-tl-3xl transition-all duration-200 ${
                    activeTab === "pending"
                      ? "bg-orange-50 text-orange-700 border-b-2 border-orange-500"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="hidden sm:inline">Pending Applications</span>
                    <span className="sm:hidden">Pending</span>
                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {counts.pending}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("approved")}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-200 ${
                    activeTab === "approved"
                      ? "bg-green-50 text-green-700 border-b-2 border-green-500"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="hidden sm:inline">Approved Applications</span>
                    <span className="sm:hidden">Approved</span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {counts.approved}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`flex-1 px-6 py-4 text-center font-medium rounded-tr-3xl transition-all duration-200 ${
                    activeTab === "rejected"
                      ? "bg-red-50 text-red-700 border-b-2 border-red-500"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-5 h-5" />
                    <span className="hidden sm:inline">Rejected Applications</span>
                    <span className="sm:hidden">Rejected</span>
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {counts.rejected}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">No applications found</h3>
                  <p className="text-neutral-600">There are no {activeTab} applications at the moment.</p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <div
                    key={application.application_id}
                    className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Header with avatar */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-neutral-900">
                              Application #{application.application_id}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <Calendar className="w-4 h-4" />
                              <span>Applied: {formatDate(application.application_date)}</span>
                            </div>
                            {/* Show approval date for approved applications */}
                            {application.status === "Approved" && application.seller_info && (
                              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                                <Check className="w-4 h-4" />
                                <span>Approved: {formatDate(application.seller_info.applied_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Application Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                                <Store className="w-4 h-4" />
                                Proposed Store Name:
                              </label>
                              <p className="text-neutral-900 font-medium">{application.seller_name}</p>
                            </div>

                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                                <User className="w-4 h-4" />
                                Seller Name:
                              </label>
                              <p className="text-neutral-900">
                                {application.buyer?.first_name} {application.buyer?.last_name}
                              </p>
                            </div>

                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                                <MapPin className="w-4 h-4" />
                                Seller Address:
                              </label>
                              <p className="text-neutral-900">{formatAddress(application.address)}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                                <Mail className="w-4 h-4" />
                                Email:
                              </label>
                              <p className="text-neutral-900">{application.buyer?.email}</p>
                            </div>

                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                                <Phone className="w-4 h-4" />
                                Phone Number:
                              </label>
                              <p className="text-neutral-900">{application.buyer?.phone || "Not provided"}</p>
                            </div>

                            {/* Valid ID Photo - moved here for better balance */}
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                <FileText className="w-4 h-4" />
                                Valid ID Photo:
                              </label>
                              <a
                                href={application.valid_id_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors duration-200 font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View ID Document
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex-shrink-0">
                        {activeTab === "pending" && (
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => handleAccept(application)}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors duration-200 font-medium whitespace-nowrap"
                            >
                              <Check className="w-5 h-5" />
                              Approve Application
                            </button>
                            <button
                              onClick={() => handleReject(application.application_id)}
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-200 font-medium whitespace-nowrap"
                            >
                              <X className="w-5 h-5" />
                              Reject Application
                            </button>
                          </div>
                        )}

                        {activeTab === "approved" && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <Check className="w-5 h-5" />
                            Application Approved
                          </span>
                        )}

                        {activeTab === "rejected" && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            <X className="w-5 h-5" />
                            Application Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationsView
